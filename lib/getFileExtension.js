export default function GetFileExtension (fname) {
    return fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);
}