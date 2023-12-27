import parse from "html-react-parser";;
import { load } from "cheerio";

//サムネイルを取得する
export function setThumbnail(res) {
        const $ = load(res.content);
        if ($('img').length) {
            //一枚目の画像を取得する
            const FirstImage = $('img').first();
            const ThumbnailProperty = {
                url: FirstImage.attr('src'),
                width: FirstImage.attr('width'),
                height: FirstImage.attr('height'),
                alt: FirstImage.attr('alt') ?? "blogs-image"
            }
            return ThumbnailProperty;
        }
    else if(res.thumbnail){
        //サムネイルの画像を取得する
        return res.thumbnail;
    }else{
        //親カテゴリーの画像を取得する
        return res.contenttype.thumbnail;   
    }
}