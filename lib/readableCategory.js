export default function ReadableCategory(category) {
    const categoryNames = {VideoGame: "Video game", Book: "Book", Movie: "Movie", TVSeries: "TV series"}
    if (category in categoryNames) {
        return(categoryNames[category])
    }
    return("Category")
}