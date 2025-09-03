// src/features/contact/ContactPage.tsx
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { increment, decrement } from "./counterReducer";

export default function ContactPage() {
  const data = useAppSelector((state) => state.counter.data);
  const dispatch = useAppDispatch();

  return (
    <>
      <Typography variant="h2" gutterBottom>Contact Page</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>Data is: {data}</Typography>

      <ButtonGroup>
        <Button color="error" onClick={() => dispatch(decrement(1))}>
          Decrement
        </Button>
        <Button color="secondary" onClick={() => dispatch(increment(1))}>
          Increment
        </Button>
        <Button color="primary" onClick={() => dispatch(increment(5))}>
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  );
}