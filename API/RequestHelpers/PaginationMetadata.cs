namespace API.RequestHelpers
{
    public class PaginationMetadata
    {
        public int TotalCount { get; set; }   // 필터 적용 전 총 개수
        public int PageSize { get; set; }     // 페이지 크기
        public int CurrentPage { get; set; }  // 현재 페이지
        public int TotalPages { get; set; }   // 총 페이지 수
    }
}