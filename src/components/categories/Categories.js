import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionTitle from '../sectionTitle/SectionTitle';
import CategoriesChild from './CategoriesChild';
import { productCategories } from '../../services/ProductCategories';
import { productCategoriesChild } from '../../services/ProductCategoriesChild';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice';
import close from "../../assets/images/close.svg";
import './categories.scss';

const Categories = ({ filterProduct}) => {

    const dispatch = useDispatch();
    const [clickedCategory, setClickedCategory] = useState(null);

    const isSheetId = useSelector((state) => state.bottomSheet.isSheetId);
    const isSheetOpen = useSelector((state) => state.bottomSheet.isSheetOpen);


    const handleCategoryClick = (category) => {
        setClickedCategory(category);
        dispatch(sheetOpen("categorySheet"));
    }

    const matchedCategory = productCategoriesChild.find(
        (category) => category.categoryFilter === clickedCategory
    );    

  return (
    <>
        <div className='categoriesWrapper'>
            <SectionTitle title="Product Categories" />
            <div className="categories--listing">
                {productCategories.map((item, index) => {
                    return (
                        <div key={index} className="categories--item"  onClick={() => filterProduct(item.value, item.title)} title={item.value}>
                            <img src={item.image} alt={item.title} className="img-fluid categories--item-image" />
                            <div className="categories--item-content">
                                <span className="categories--item-content-count">{item.count}</span>
                                <span className="categories--item-content-name">{item.title}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {matchedCategory && (
            <BottomSheet
                open={isSheetId === "categorySheet" && isSheetOpen}
                onDismiss={() => dispatch(sheetClose())}
                defaultSnap={({ snapPoints, lastSnap }) =>
                    lastSnap ?? Math.min(...snapPoints)
                }
                header={
                    <div className='sheetHeader'>
                        <SectionTitle title="Product Menu" />
                        <div className='sheetHeader--close' onClick={() => dispatch(sheetClose())}>
                            <img src={close} alt='BottomSheet Close' className='img-fluid' />
                        </div>
                    </div>
                }
            >
                <div className='sheetBody'>
                    <CategoriesChild matchedCategory={matchedCategory} />
                </div>
            </BottomSheet>
        ) }
    </>
  )
}

export default Categories
