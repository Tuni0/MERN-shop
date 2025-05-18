import {CheckoutProvider } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

import axios from "axios";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51RPhVtHCNzKlr0IWldDX2ZLLsX6BoTh7iLu4CMiJtG0bXEhtiJiLBJximbFY0C2b9D6gujO2p6LNdZDbi71VPBIR003ozScsLB');

const fetchClientSecret = () => {
  axios.defaults.withCredentials = true;

  return axios.post('https://localhost:3006/create-checkout-session')
    .then((result) => 
    {
       console.log(result);

       return result
    })
};

export default function Payment() {
  return (
    <CheckoutProvider   stripe={stripePromise}  options={{fetchClientSecret}}>
      <CheckoutForm />
    </CheckoutProvider >
  );
}