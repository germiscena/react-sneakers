import axios from 'axios';
import React from 'react'
import Card from '../components/Card';

 function Orders(){
   const [orders, setOrders] = React.useState([])
   const [isLoading, setIsLoading] = React.useState(true);

   React.useEffect(()=>{
     (async ()=>{
      const {data}=await axios.get('https://6231db6b59070d92733cb82a.mockapi.io/orders')
      setOrders(data.map((obj)=> obj.items).flat())
      setIsLoading(false)
    })()
   }, [])
     return (<div className="content p-40">
     <div className="d-flex align-center justify-between mb-40">
       <h1>Мои заказы</h1></div>
     <div className="d-flex flex-wrap">
     {(isLoading ?[...Array(8)]:orders).map((items, index) => (
           <Card
           key={index}
           {...items}
           loading={isLoading}
           />
         ))}
     </div>
   </div>)
 }

 export default Orders;
 