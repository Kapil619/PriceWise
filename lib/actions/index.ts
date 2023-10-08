"use server"

import Product from "../models/product.model";
import { connecttoDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getHighestPrice, getLowestPrice, getAveragePrice } from "../utils";
import { revalidatePath } from "next/cache";


export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) {
        return;

        try {
            connecttoDB();
            const scrappedProduct = await scrapeAmazonProduct(productUrl);
            if (!scrappedProduct) return;

            let product = scrappedProduct;
            const existingProduct = await Product.findOne({ url: scrappedProduct?.url });



            if (existingProduct) {
                const updatedPriceHistory: any = [
                    ...existingProduct.priceHistory, {
                        price: scrappedProduct?.currentPrice
                    }
                ]
                product = {
                    ...scrappedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                }
            }

            const newProduct = await Product.findOneAndUpdate({
                url: scrappedProduct?.url
            }, product, { upsertL: true, new: true });

            revalidatePath(`/products/${newProduct._id}}`)

        } catch (error: any) {
            throw new Error(`Failed to create/update product: ${error.message}`)
        }
    }
}


export async function getProductById(productId: String) {

    try {
        connecttoDB();
        const product = await Product.findOne({ _id: productId });


        if (!product) return product;
    } catch (error) {
        console.log(error);


    }
}