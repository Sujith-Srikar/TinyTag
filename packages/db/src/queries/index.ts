import { db } from "../client"
import { Database } from "../types.js";

type LinksTable = Database['public']['Tables']['links']['Row'];

const getLinkBySlug = async (slug: string) : Promise<LinksTable | null> => {
    const {data, error} = await db.from('links').select('*').eq('slug',slug).single();

    if(error) return null;

    return data;
}

const create_short_url = async (slug: string, longUrl: string) => {
    const {error} = await db.from('links').insert({slug: slug, longurl: longUrl});
    return error;
};

const edit_long_url = async (slug: string, newLongUrl: string) => {
    const {error} = await db.from('links').update({longurl: newLongUrl}).eq('slug', slug);
    return error
}

export {getLinkBySlug, create_short_url, edit_long_url};