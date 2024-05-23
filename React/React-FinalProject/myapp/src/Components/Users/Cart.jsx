import { Box, Button, Chip, Drawer } from '@mui/material'
import React, { useState } from 'react'
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useSelector } from 'react-redux';
import { addDocToCollection } from '../../FireBase/firebaseUtils';
const CartComp = ({ isShowCart, setIsShowCart, makeOrder, setMakeOrder }) => {
  const products = useSelector((state) => state.products)

  const deleteProductFromCart = (order) => {
    setMakeOrder(makeOrder.map(ord => ord.productId != order.productId ? ord : { ...ord, quantity: 0 }))
  }

  const getProductFromOrder = (order) => {
    return products.find(product => product.id == order.productId)
  }


  const submitOrder = () => {
    makeOrder.forEach(orderItem => {
      if (orderItem.quantity > 0) {
        const obj = {
          date: "20.5.2024",
          productId: orderItem.productId,
          quantity: orderItem.quantity,
          userId: sessionStorage['userId']
        }
        addDocToCollection('orders', obj)
      }
    });
  }


  const calculateSumOrder = () => {
    var sum = 0;
    makeOrder.forEach(orderItem => {
      sum += getProductFromOrder(orderItem).price * orderItem.quantity
    });
    return sum;
  }

  return (
    <div>
      <Drawer open={isShowCart} anchor='left' PaperProps={{ sx: { width: '20%' } }}>
        <div style={{ margin: '2%' }}>
          <h1 style={{ display: 'flex', justifyContent: 'center' }}>Cart</h1>

          <KeyboardBackspaceOutlinedIcon style={{ position: 'absolute', right: 0, top: '50%', margin: '10px', cursor: 'pointer' }}
            onClick={() => setIsShowCart(false)} />
          {
            makeOrder.map((order, index) => {
              if (order.quantity > 0)
                return <Chip key={index} onDelete={() => deleteProductFromCart(order)}
                  sx={{ width: '100%' }}
                  label={
                    <Box>
                      <label>{getProductFromOrder(order).name} - </label>
                      <button>+</button>
                      <label>{order.quantity}</label>
                      <button>-</button>
                      <label>units - Total: </label>
                      <label>{getProductFromOrder(order).price * order.quantity}$ </label>
                    </Box>
                  }
                />
            })
          }

          <br /><br /><br /><br />
          <br /><br /><br /><br />

          <b><label>Total: {calculateSumOrder()}$ </label></b><br />

          <Button sx={{ width: '30%', borderRadius: '20px' }} variant="contained" color="success"
            onClick={submitOrder}>{'Order'}</Button>
        </div>
      </Drawer>
    </div >
  )
}

export default CartComp