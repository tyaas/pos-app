import { Category, Product } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductForm from "./product-form";

interface Props {
    products: Product[];
    categories: Category[];
}

export default function ProductsIndex({ products, categories }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    function handleEdit(product: Product) {
        setEditing(product);
        setShowForm(true);
    }

    function handleDelete(product: Product) {
        if (!confirm(`Delete "${product.name}"?`)) return;

        router.delete(`/products/${product.id}`, {
            onSuccess: () => toast.success("Product deleted."),
            onError: () => toast.error("Failed to delete product."),
        });
    }

    function handleClose() {
        setShowForm(false);
        setEditing(null);
    }

    return (
        <>
            <Head title="Products" />

            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>

                    <button
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                        className="flex items-center rounded-md bg-white px-4 py-2 text-black"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </button>
                </div>

                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Stock</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8  text-center text-muted-foreground"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            )}

                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b last:border-0 hover:bg-muted/30"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {product.category.name}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        ${product.price}
                                    </td>

                                    <td
                                        className={`px-4 py-3 text-right ${
                                            product.stock <= 5
                                                ? "font-semibold text-orange-500"
                                                : ""
                                        }`}
                                    >
                                        {product.stock}
                                        {product.stock === 0 && (
                                            <span className="ml-1 text-xs text-destructive">
                                                (out)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge
                                            variant={
                                                product.is_active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {product.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Pencil className="h-4 w-4"></Pencil>
                                        </Button>
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            onClick={() =>
                                                handleDelete(product)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showForm && (
                <ProductForm
                    categories={categories}
                    product={editing}
                    onClose={handleClose}
                />
            )}
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [{ title: "Products", href: "/products" }],
};
