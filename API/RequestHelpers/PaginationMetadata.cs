namespace API.RequestHelpers
{
    public class PaginationMetadata
    {
        public int TotalCount { get; set; }   // Total items before filtering
        public int PageSize { get; set; }     // Number of items per page
        public int CurrentPage { get; set; }  // Current page index (1-based)
        public int TotalPages { get; set; }   // Total number of pages
    }
}
