export default function formatCreationDate(element) {
    const minutes = (element.creationDate.getMinutes()<10?'0':'') + element.creationDate.getMinutes();
    const hours = (element.creationDate.getHours()<10?'0':'') + element.creationDate.getHours();
    const date = element.creationDate.getDate();
    const month = element.creationDate.getMonth();
    const year = element.creationDate.getFullYear();
    element.creationDate = `${year}/${month + 1}/${date} ${hours}:${minutes}`
    return element;
}