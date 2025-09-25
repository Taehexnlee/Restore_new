using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace API.Middleware;

public class ExceptionMiddleware : IMiddleware
{
    private readonly IHostEnvironment _env;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger)
    {
        _env = env;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            // Invoke the next middleware in the pipeline
            await next(context);
        }
        catch (Exception ex)
        {
            // Handle exceptions in a centralized manner
            await HandleException(context, ex);
        }
    }

    private async Task HandleException(HttpContext context, Exception ex)
    {
        // Log the exception details
        _logger.LogError(ex, ex.Message);

        // Prepare error response payload
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new ProblemDetails
        {
            Status = 500,
            Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
            Title = ex.Message
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
    }
}
