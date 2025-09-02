import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../../app/models/product";
import { Button, Divider, Grid2, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";

export default function ProductDetails() {

  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
 
  useEffect(() => {
    fetch(`https://localhost:5001/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const productDetails = [
    { label: "Name", value: product.name },
    { label: "Description", value: product.description },
    { label: "Type", value: product.type },
    { label: "Brand", value: product.brand },
    { label: "Quantity in Stock", value: product.quantityInStock },
  ];
  return (
    <Grid2 container spacing={6} sx={{ maxWidth: "lg", mx: "auto" }}>
      {/* Left: Image */}
      <Grid2 size={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid2>

      {/* Right: Details */}
      <Grid2 size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${ (product.price / 100).toFixed(2) }
        </Typography>

        <TableContainer sx={{ mt: 2 }}>
          <Table>
          <TableBody>
            {productDetails.map((detail, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontWeight: "bold" }}>{detail.label}</TableCell>
                <TableCell>{detail.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>

        <Grid2 container spacing={2} sx={{ mt: 3 }}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in basket"
              fullWidth
              defaultValue={1}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              Add to basket
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}