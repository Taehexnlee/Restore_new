namespace API.RequestHelpers
{
    public class ProductParams : PaginationParams
    {
        public string? OrderBy    { get; set; }   // price | priceDesc | (기본: name)
        public string? SearchTerm { get; set; }   // 키워드(부분일치)
        public string? Brands     { get; set; }   // "Angular,React"
        public string? Types      { get; set; }   // "Boots,Hats"
    }
}