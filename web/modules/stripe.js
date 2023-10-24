import { useAddAndWaitForSnapshot, useDocument } from "@zachsents/fire-query"
import { useQuery } from "react-query"
import { useUser } from "reactfire"
import { STRIPE_CUSTOMERS_COLLECTION, STRIPE_PRODUCTS_COLLECTION } from "shared/firestore"
import { PRODUCT_IDS, PRICE_IDS } from "shared/stripe"
import { fire } from "./firebase"
import { useFunctionMutation } from "@zachsents/fire-query"



/**
 * @param {"starter" | "business"} productName
 */
export function useProductInfo(productName) {
    const docQuery = useDocument([STRIPE_PRODUCTS_COLLECTION, PRODUCT_IDS[productName]])
    return docQuery
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


export function useCreateCheckoutSession(productName, annual = true) {

    const { data: user } = useUser()

    const addMutation = useAddAndWaitForSnapshot([STRIPE_CUSTOMERS_COLLECTION, user?.uid, "checkout_sessions"], {
        errorProp: "error",
        successProp: "url",
    })

    const createCheckoutSession = async () => {
        const { url } = await addMutation.mutateAsync({
            price: PRICE_IDS[productName][annual ? "annual" : "monthly"],
            success_url: window.location.href,
            cancel_url: window.location.href,
            allow_promotion_codes: true,
        })

        window.location.assign(url)
    }

    return [createCheckoutSession, addMutation]
}


export function useGoToCustomerPortal() {

    const funcMutation = useFunctionMutation("ext-firestore-stripe-payments-createPortalLink")

    const goToPortal = async () => {
        const { data: { url } } = await funcMutation.mutateAsync({
            returnUrl: window.location.href,
        })
        window.location.assign(url)
    }

    return [goToPortal, funcMutation]
}