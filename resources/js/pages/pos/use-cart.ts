import { useReducer, useMemo } from "react";
import { CartItem, Product } from "@/types";

type CartAction =
    | { type: "ADD"; product: Product }
    | { type: "Remove"; productId: number }
    | { type: "SET_QTY"; productId: number; quantity: number }
    | { type: "CLEAR" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
    switch (action.type) {
        case "ADD": {
            const existing = state.find(
                (i) => i.product.id === action.product.id,
            );
            if (existing) {
                return state.map((i) =>
                    i.product.id === action.product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                );
            }
            return [...state, { product: action.product, quantity: 1 }];
        }
        case "Remove":
            return state.filter((i) => i.product.id !== action.productId);

        case "SET_QTY": {
            if (action.quantity <= 0) {
                return state.filter((i) => i.product.id !== action.productId);
            }
            return state.map((i) =>
                i.product.id === action.productId
                    ? { ...i, quantity: action.quantity }
                    : i,
            );
        }

        case "CLEAR":
            return [];
        default:
            return state;
    }
}

export function useCart() {
    const [items, disPatch] = useReducer(cartReducer, []);

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
                0,
            ),
        [items],
    );

    return {
        items,
        subtotal,
        addItem: (product: Product) => disPatch({ type: "ADD", product }),
        removeItem: (productId: number) =>
            disPatch({ type: "Remove", productId }),
        setQuantity: (productId: number, quantity: number) =>
            disPatch({ type: "SET_QTY", productId, quantity }),
        clear: () => disPatch({ type: "CLEAR" }),
    };
}
