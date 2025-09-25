using System;
using System.Linq;
using System.Collections.Generic;

namespace API.Entities;

public class Basket
{
    public int Id { get; set; }

    // Identifier persisted in the browser via cookie/local storage
    public required string BasketId { get; set; }

    // Items belonging to this basket
    public List<BasketItem> Items { get; set; } = new();
    
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
    

    /// <summary>
    /// Add an item to the basket, increasing quantity if it already exists
    /// </summary>
    public void AddItem(Product product, int quantity)
    {
        // Defensive guard clauses
        ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0)
            throw new ArgumentException("Quantity should be greater than zero.", nameof(quantity));

        // Check whether the item already exists
        var existingItem = FindItem(product.Id);

        if (existingItem is null)
        {
            // Add a brand new item
            Items.Add(new BasketItem
            {
                ProductId = product.Id,
                Product = product,
                Quantity = quantity
            });
        }
        else
        {
            // Increase quantity on the existing item
            existingItem.Quantity += quantity;
        }
    }

    /// <summary>
    /// Reduce quantity or remove if the count reaches zero
    /// </summary>
    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity should be greater than zero.", nameof(quantity));

        var item = FindItem(productId);
        if (item is null) return; // Nothing to remove

        item.Quantity -= quantity;

        // Remove the item when quantity drops to zero
        if (item.Quantity <= 0)
            Items.Remove(item);
    }

    /// <summary>
    /// Retrieve a basket item by product identifier
    /// </summary>
    private BasketItem? FindItem(int productId)
        => Items.FirstOrDefault(i => i.ProductId == productId);
}
