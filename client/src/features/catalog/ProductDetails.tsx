import { useParams } from "react-router-dom";
import { Button, Divider, Grid2, Table, TableBody, TableCell, TableContainer, TextField, Typography } from "@mui/material";
import { useFetchProductDetailsQuery } from "./catalogApi";

export default function ProductDetails() {
  const { id } = useParams();
  const productId = +(id ?? 0);
  const { data: product, isLoading } = useFetchProductDetailsQuery(productId);

  if (!product || isLoading) return <div>Loading...</div>;

  const productDetails = [
    { label: 'Name', value: product.name },
    { label: 'Description', value: product.description },
    { label: 'Type', value: product.type },
    { label: 'Brand', value: product.brand },
    { label: 'Quantity in stock', value: product.quantityInStock },
  ];

  return (
    <Grid2 container spacing={6} sx={{ maxWidth: 'lg', mx: 'auto' }}>
      <Grid2 size={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: '100%' }}
        />
      </Grid2>

      <Grid2 size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h4" color="secondary">
          ${ (product.price / 100).toFixed(2) }
        </Typography>

        <TableContainer sx={{ '& td': { fontSize: '1rem' }, mt: 2 }}>
          <Table>
            <TableBody>
              {productDetails.map((d, idx) => (
                <tr key={idx}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{d.label}</TableCell>
                  <TableCell>{d.value}</TableCell>
                </tr>
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
              sx={{ height: 55 }}
            >
              Add to basket
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}