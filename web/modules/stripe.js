import { useDocument } from "@zachsents/fire-query"
import { useQuery } from "react-query"
import { useUser } from "reactfire"
import { STRIPE_PRODUCTS_COLLECTION } from "shared/firestore"
import { fire } from "./firebase"



/**
 * @param {"starter" | "business"} productName
 */
export function useProductInfo(productName) {
    const docQuery = useDocument([STRIPE_PRODUCTS_COLLECTION, PRODUCT_IDS[productName]])
    return docQuery
}


const PRODUCT_IDS = {
    starter: "prod_Oqnzd94uPZBnwi",
    business: "prod_Oqo0w5ztKoYb0s",
}


export function useUserClaims() {
    const { data: user } = useUser()

    return useQuery({
        queryFn: async () => {
            if (!fire.auth.currentUser)
                return

            await fire.auth.currentUser.getIdToken(true)
            const token = await fire.auth.currentUser.getIdTokenResult()
            return token.claims
        },
        queryKey: [user?.uid],
    })
}

// Let's do this later -- won't work with the emulator

// export async function redirectToCustomerPortal() {
//     const functionRef = httpsCallable(fire.functions, "ext-firestore-stripe-payments-createPortalLink")
//     const { data } = await functionRef({
//         returnUrl: window.location.origin,
//         //   configuration: "bpc_1JSEAKHYgolSBA358VNoc2Hs", // Optional ID of a portal configuration: https://stripe.com/docs/api/customer_portal/configuration
//     })
//     window.location.assign(data.url)
// }


// export function useCustomerPortalLink() {
//     return useMutation({
//         mutationFn: redirectToCustomerPortal,
//     })
// }


// export async function useCreateCheckoutSession() {

//     const {data: user} = useUser()

//     const



//     const docRef = await db
//   .collection('stripe-customers')
//   .doc(currentUser.uid)
//   .collection('checkout_sessions')
//   .add({
//     price: 'price_1GqIC8HYgolSBA35zoTTN2Zl',
//     success_url: window.location.origin,
//     cancel_url: window.location.origin,
//   });
// // Wait for the CheckoutSession to get attached by the extension
// docRef.onSnapshot((snap) => {
//   const { error, url } = snap.data();
//   if (error) {
//     // Show an error to your customer and
//     // inspect your Cloud Function logs in the Firebase console.
//     alert(`An error occured: ${error.message}`);
//   }
//   if (url) {
//     // We have a Stripe Checkout URL, let's redirect.
//     window.location.assign(url);
//   }
// });
// }