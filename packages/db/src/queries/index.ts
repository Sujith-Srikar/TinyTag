import { db } from "../client"
import { Database } from "../types.js";

type LinksTable = Database['public']['Tables']['links']['Row'];

const getLinkBySlug = async (slug: string) : Promise<LinksTable | null> => {
    const {data, error} = await db.from('links').select('*').eq('slug',slug).single();

    if(error) return null;

    return data;
}

export {getLinkBySlug};