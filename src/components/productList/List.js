import React, { useEffect, useState, useRef } from 'react';
import Card from '../card/Card';
import Searchbox from '../searchbox/Searchbox';
import Pageinfo from '../pageinfo/Pageinfo';
import SectionTitle from '../sectionTitle/SectionTitle';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts, setLoading, setTotalProducts, setProductType, clearProducts } from '../../redux/productSlice';
import Categories from '../categories/Categories';
import ScrollToTop from '../scrollTop/ScrollToTop';
import { fetchProductsData } from '../../services/fetchProductData';
import './list.scss';

const List = () => {
  const dispatch = useDispatch();
  const productsList = useSelector((state) => state.products.items);
  const {totalProducts, productType} = useSelector((state) => state.products);
  const isLoading = useSelector((state) => state.products.loading);
  const [page, setPage] = useState(1);
  const [lastPageNumber, setLastPageNumber] = useState(null);
  const observerRef = useRef(null);
  const {storeCode, agentCodeOrPhone} = useSelector((state) => state.agent);
  const {customer_id} = useSelector((state) => state.user);
  const selectedStore = useSelector((state) => state.nearbyStore.selectedStore);
  const [categoriesName, setCategoriesName]= useState('');  

  const fetchProducts = async (currentPage) =>  {
    console.log(selectedStore);
    const selectedStoreCode = selectedStore?.code;
    if (lastPageNumber && currentPage > lastPageNumber) return;
    dispatch(setLoading(true)); 
    try {    
      const productResponseData = await fetchProductsData(selectedStoreCode ? selectedStoreCode : storeCode, agentCodeOrPhone, customer_id, categoriesName, currentPage);      
      if (productResponseData.data.status === 'success') {
        dispatch(setProducts(productResponseData.data.products)); 
        dispatch(setProductType(productResponseData.data.product_types));
        dispatch(setTotalProducts(productResponseData.data.productCount));
        setLastPageNumber(productResponseData.data.lastPageNumber); 
      }
    } catch (error) {
      console.error('Error Fetching data:', error);
      dispatch(setLoading(false));
    }
  };

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && (!lastPageNumber || page < lastPageNumber)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    const productToObserveIndex = (page - 1) * 20 + 15; // 15th product of the current page
    const productToObserve = document.querySelector(`.productCategories--item-${productToObserveIndex}`);

    if (productToObserve) {
      observer.observe(productToObserve);
    }

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [productsList, page, categoriesName]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, categoriesName, selectedStore]);

  const [showCategory, setShowCategory] = useState(true);

  const handleExperienceClick = () => {
    if (!showCategory) {
      setShowCategory(true);
    }
  };

  const [activeCategory, setActiveCategory] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('All Jewellery'); 
  const filterProduct = (id, title)=>{
    setShowCategory(false);
    setCategoryTitle(title);
    fetchProducts(page);
    setCategoriesName(id);
    setActiveCategory(id);
    dispatch(clearProducts());
    setPage(1);
  }

  return (
    <>
      <Searchbox />
      {!showCategory && (
        <div className="plpWrapper">
          <SectionTitle title="Product Catalogue (Instore)" />
          <div className="productCategories">
            <p className="productCategories-title">Product Categories</p>
            <div className='productCategories--options'>
              <ul className="productCategories--lists">
                <li className={`productCategories--item ${activeCategory === '' ? 'active' : ''}`} onClick={() => filterProduct('', 'All Jewellery')}>All Jewellery</li>
                <li className={`productCategories--item ${activeCategory === '583' ? 'active' : ''}`} onClick={() => filterProduct('583', 'Rings')}>Rings</li>
                <li className={`productCategories--item ${activeCategory === '584' ? 'active' : ''}`} onClick={() => filterProduct('584', 'Earrings')}>Earrings</li>
                <li className={`productCategories--item ${activeCategory === '682' ? 'active' : ''}`} onClick={() => filterProduct('682', 'Necklace')}>Necklace</li>
              </ul>
              <div className='productCategories--action' onClick={handleExperienceClick}>Experience Candere</div>
            </div>
          </div>
          <Pageinfo
            title={categoryTitle}
            count={
              totalProducts > 1
                ? `${totalProducts} Items`
                : `${totalProducts} Item`
            }
          />
          <div className="cardWrapper">
            {productsList?.length > 0 && (
              productsList.map((item, index) => (
                <Card
                  key={`ps-${index + 1}`}
                  item={item}
                  className={`productCategories--item-${index + 1}`}
                />
              ))
            )}
            <ScrollToTop/>
        </div>
          {isLoading && (
            <div className="cardWrapper placeholderLoading" style={{"marginTop": "20px"}}>
                  <div className="ph-item alignItemCenter">
                      <div className="ph-col-12">
                          <div className="ph-picture mb-15"></div>
                          <div className="ph-row">                            
                              <div className="ph-col-4"></div>
                              <div className="ph-col-8 empty"></div>
                              <div className="ph-col-6"></div>
                              <div className="ph-col-6 empty"></div>
                              <div className="ph-col-12"></div>
                          </div>
                      </div>
                  </div>
                  <div className="ph-item alignItemCenter">
                      <div className="ph-col-12">
                          <div className="ph-picture mb-15"></div>
                          <div className="ph-row">                           
                              <div className="ph-col-4"></div>
                              <div className="ph-col-8 empty"></div>
                              <div className="ph-col-6"></div>
                              <div className="ph-col-6 empty"></div>
                              <div className="ph-col-12"></div>
                          </div>
                      </div>
                  </div>
                  <div className="ph-item alignItemCenter">
                      <div className="ph-col-12">
                          <div className="ph-picture mb-15"></div>
                          <div className="ph-row">                            
                              <div className="ph-col-4"></div>
                              <div className="ph-col-8 empty"></div>
                              <div className="ph-col-6"></div>
                              <div className="ph-col-6 empty"></div>
                              <div className="ph-col-12"></div>
                          </div>
                      </div>
                  </div>
                  <div className="ph-item alignItemCenter">
                      <div className="ph-col-12">
                          <div className="ph-picture mb-15"></div>
                          <div className="ph-row">                            
                              <div className="ph-col-4"></div>
                              <div className="ph-col-8 empty"></div>
                              <div className="ph-col-6"></div>
                              <div className="ph-col-6 empty"></div>
                              <div className="ph-col-12"></div>
                          </div>
                      </div>
                  </div>
                  <div className="ph-item alignItemCenter">
                      <div className="ph-col-12">
                          <div className="ph-picture mb-15"></div>
                          <div className="ph-row">                            
                              <div className="ph-col-4"></div>
                              <div className="ph-col-8 empty"></div>
                              <div className="ph-col-6"></div>
                              <div className="ph-col-6 empty"></div>
                              <div className="ph-col-12"></div>
                          </div>
                      </div>
                  </div>
                  <div className="ph-item alignItemCenter">
                      <div className="ph-col-12">
                          <div className="ph-picture mb-15"></div>
                          <div className="ph-row">                            
                              <div className="ph-col-4"></div>
                              <div className="ph-col-8 empty"></div>
                              <div className="ph-col-6"></div>
                              <div className="ph-col-6 empty"></div>
                              <div className="ph-col-12"></div>
                          </div>
                      </div>
                  </div>
              </div> 
          )}
          {!isLoading && lastPageNumber && page >= lastPageNumber && (
            <div className="endOfDataMessage" style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>No more data to load</p>
            </div>
          )}
        </div>
      )}
      {showCategory && <Categories filterProduct={filterProduct}/>}
    </>
  );
};

export default List;
