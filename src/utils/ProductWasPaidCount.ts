 const ProductManager = () =>{
    let productWasPaidCount : number 

    const getProductCount= () => productWasPaidCount
    const setProductCount = (value : number) =>{
        productWasPaidCount = value
    }
return {getProductCount,setProductCount}
}
export default ProductManager()