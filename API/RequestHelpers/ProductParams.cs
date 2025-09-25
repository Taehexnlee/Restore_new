namespace API.RequestHelpers
{
    public class ProductParams : PaginationParams
    {
        public string? OrderBy    { get; set; }   // e.g. price | priceDesc | name
        public string? SearchTerm { get; set; }   // Partial match keyword
        public string? Brands     { get; set; }   // Comma-separated list, e.g. "Angular,React"
        public string? Types      { get; set; }   // Comma-separated list, e.g. "Boots,Hats"
    }
}
