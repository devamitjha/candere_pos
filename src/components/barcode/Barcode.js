import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import camera from "../../assets/images/camera.svg";
import { setBarcode } from '../../redux/barcodeSlice';
import { fetchProducts } from '../../redux/searchSlice';
import { useSelector, useDispatch } from 'react-redux';

function BarcodeScanner() {
  const dispatch = useDispatch();
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null); // Use a ref to attach to the scanner element
  const [searchProduct, setSearchProduct] = useState('');
  const agent = useSelector((state) => state.agent);
  const { isUser, customer_id} = useSelector((state) => state.user);

  // Start the scanner when the button is clicked
  const startScanner = async () => {
    // Check and request camera permission
    const permission = await navigator.permissions.query({ name: 'camera' });
    if (permission.state === 'denied') {
      alert('Camera access denied. Please allow camera access.');
      return;
    }

    setScanning(true);
    // Wait until the scanner element is rendered in the DOM
    setTimeout(() => {
      if (scannerRef.current) {
        Quagga.init({
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scannerRef.current, // Use the ref for the scanner element
            constraints: {
              width: 730,
              //height: 320,
              facingMode: 'environment' // Rear camera
            }
          },
          decoder: {
            readers: ['code_128_reader', 'ean_reader'] // Add more readers if needed
          }
        }, function (err) {
          if (err) {
            console.error('Error initializing Quagga:', err);
            return;
          }
          console.log('Quagga initialized successfully');
          Quagga.start();
        });

        // Handle detection
        Quagga.onDetected((data) => {
          console.log('Barcode detected: ', data.codeResult.code);
          dispatch(setBarcode(data.codeResult.code));
          const newBarcode = data.codeResult.code;
          dispatch(fetchProducts(searchProduct, agent.storeCode, agent.agentCodeOrPhone, customer_id, newBarcode))
          Quagga.stop(); // Stop scanning after barcode detection
          setScanning(false); // Close the camera
        });
      }
    }, 300); // Short delay to ensure the scanner element is ready
  };

  // Cleanup function when stopping scanner or unmounting component
  useEffect(() => {
    return () => {
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning]);

  return (
    <>
      {/* Button to Start Scanning */}
      <div className="searchBox--input-icon" title="Camera" onClick={startScanner} style={{top: '30px'}}>
        <img src={camera} alt="Camera" className="img-fluid" />
      </div>

      {/* Display camera stream only when scanning */}
      {scanning && (
        <div
          ref={scannerRef} // Attach ref to this element
          id="scanner"
          style={{ width: '100%', height: '100%', marginTop: '20px' }}
        ></div>
      )}
      </>
  );
}

export default BarcodeScanner;
