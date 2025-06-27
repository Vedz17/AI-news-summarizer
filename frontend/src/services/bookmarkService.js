// ✅ Bookmark Service (Handles Local Storage)
export const getBookmarks = () => {
    const bookmarks = localStorage.getItem("bookmarks");
    return bookmarks ? JSON.parse(bookmarks) : [];  // ✅ Get saved bookmarks
  };
  
  export const saveBookmark = (article) => {
    const bookmarks = getBookmarks();
    if (!bookmarks.some((item) => item.url === article.url)) {
      bookmarks.push(article); // ✅ Add only if not already bookmarked
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  };
  
  export const removeBookmark = (url) => {
    let bookmarks = getBookmarks();
    bookmarks = bookmarks.filter((item) => item.url !== url);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  };
  