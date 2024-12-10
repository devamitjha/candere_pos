import React from 'react';
import List from '../../components/productList/List';
import { useSelector } from 'react-redux';

const CustomerDetails = () => {
  const agent = useSelector((state) => state.agent);
  return (
    <>   
        <List/>
    </>
  )
}

export default CustomerDetails
