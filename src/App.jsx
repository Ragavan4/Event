import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Stack,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("friends")) || [];
    setData(saved);
  }, []);

  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem("friends", JSON.stringify(newData));
  };

  const addFriend = () => {
    if (!name.trim() || !amount) return;
    const newFriend = { name: name.trim(), amount: Number(amount) };
    saveData([...data, newFriend]);
    setName("");
    setAmount("");
  };

  const update = (index, key, value) => {
    const newData = [...data];
    newData[index][key] = key === "amount" ? Number(value) || 0 : value;
    saveData(newData);
  };

  const remove = (index) => {
    saveData(data.filter((_, i) => i !== index));
  };

  const total = data.reduce((sum, f) => sum + f.amount, 0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        background: "linear-gradient(135deg, #1f3a0d, #80c582)",
      }}
    >
      <Container maxWidth="sm">
        {/* Paper Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            align="center"
            sx={{ color: "#1f3a0d" }}
          >
            Event Expense 
          </Typography>

          {/* Add Friend Form */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            mb={2}
          >
            <TextField
              size="small"
              label="Friend Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              size="small"
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={addFriend}
              sx={{ minWidth: 80 ,  background: "linear-gradient(135deg, #1f3a0d, #80c582)",}}
            >
              Add
            </Button>
          </Stack>

          {/* Expense Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table stickyHeader size="small">
              <TableHead backgroundColor="red" >
                <TableRow sx={{ backgroundColor: "#dbe6db27", color: "#fff" }}>
                  <TableCell sx={{ color: "#000000ff", fontWeight: "bold" }}>
                    Friend
                  </TableCell>
                  <TableCell sx={{ color: "#000000ff", fontWeight: "bold" }}>
                    Amount
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#000000ff", fontWeight: "bold" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:"#f5f0f01e",
                      "&:hover": { backgroundColor: "#f3e9f357" },
                    }}
                  >
                    <TableCell>
                      <TextField
                        variant="standard"
                        size="small"
                        value={row.name}
                        onChange={(e) =>
                          update(index, "name", e.target.value)
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="standard"
                        size="small"
                        type="number"
                        value={row.amount}
                        onChange={(e) =>
                          update(index, "amount", e.target.value)
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Total */}
          <Typography
            variant="subtitle1"
            align="right"
            fontWeight="bold"
            sx={{ mt: 2, color: "#1f3a0d" }}
          >
            Total: ₹ {total}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
