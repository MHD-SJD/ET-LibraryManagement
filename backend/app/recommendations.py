from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def recommend(books: list[dict], interests: list[str], borrowed_book_ids: list[str], limit: int) -> list[dict]:
    """Content-based recommendations using categories, tags, descriptions and prior loans."""
    available = [book for book in books if book.get("availableCopies", 0) > 0]
    if not available:
        return []

    corpus = [" ".join([book.get("title", ""), book.get("author", ""), book.get("category", ""), " ".join(book.get("tags", [])), book.get("description", "")]) for book in available]
    profile_parts = list(interests)
    profile_parts.extend(
        " ".join([book.get("category", ""), " ".join(book.get("tags", [])), book.get("description", "")])
        for book in books if book.get("id") in borrowed_book_ids
    )
    profile = " ".join(profile_parts).strip()
    if not profile:
        return sorted(available, key=lambda book: (book.get("rating", 0), book.get("popular", False)), reverse=True)[:limit]

    matrix = TfidfVectorizer(stop_words="english").fit_transform(corpus + [profile])
    scores = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
    ranked = sorted(zip(available, scores), key=lambda pair: pair[1], reverse=True)
    results = []
    for book, score in ranked:
        if book.get("id") in borrowed_book_ids:
            continue
        result = dict(book)
        result["matchScore"] = round(float(score) * 100)
        result["reason"] = "Matches your interests and reading history"
        results.append(result)
        if len(results) == limit:
            break
    return results
