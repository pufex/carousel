export async function FetchProducts<T>(url: string): Promise<T>{
    
    try{
        const res = await fetch(url);
        const products: T = await res.json();
        return products;
    } catch(error) {
        console.error(`Failed to fetch data: ${error.message}`)
    }
}