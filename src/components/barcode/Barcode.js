import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import camera from "../../assets/images/camera.svg";
import { setBarcode } from '../../redux/barcodeSlice';
import { fetchProducts } from '../../redux/searchSlice';
import { useSelector, useDispatch } from 'react-redux';

function BarcodeScanner() {
  const dispatch = useDispatch();
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const [searchProduct, setSearchProduct] = useState('');
  const agent = useSelector((state) => state.agent);
  const { isUser, customer_id } = useSelector((state) => state.user);

  const startScanner = async () => {
    const permission = await navigator.permissions.query({ name: 'camera' });
    if (permission.state === 'denied') {
      alert('Camera access denied. Please allow camera access.');
      return;
    }

    setScanning(true);

    setTimeout(() => {
      if (scannerRef.current) {
        Quagga.init(
          {
            inputStream: {
              name: 'Live',
              type: 'LiveStream',
              target: scannerRef.current,
              constraints: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment',
              },
            },
            decoder: {
              readers: ['code_128_reader', 'ean_reader'],
            },
          },
          function (err) {
            if (err) {
              console.error('Error initializing Quagga:', err);
              return;
            }
            console.log('Quagga initialized successfully');
            Quagga.start();
          }
        );

        Quagga.onDetected((data) => {
          console.log('Barcode detected: ', data.codeResult.code);
          dispatch(setBarcode(data.codeResult.code));
          const newBarcode = data.codeResult.code;
          dispatch(
            fetchProducts(
              searchProduct,
              agent.storeCode,
              agent.agentCodeOrPhone,
              customer_id,
              newBarcode
            )
          );
          Quagga.stop();
          setScanning(false);
        });
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning]);

  return (
    <>
      <div
        className="searchBox--input-icon"
        title="Camera"
        onClick={startScanner}
        style={{ top: '30px' }}
      >
        <img src={camera} alt="Camera" className="img-fluid" />
      </div>

      {scanning && (
        <div
          ref={scannerRef}
          id="scanner"
          style={{
            width: '730px',
            height: '320px',
            margin: '20px auto',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #ccc',
          }}
        ></div>
      )}
    </>
  );
}

export default BarcodeScanner;
