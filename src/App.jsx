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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Autocomplete } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import "./App.css";

import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update,
  remove,
} from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB_aaVj4sj67dDPGwTpw9d4dQid4IOClFw",
  authDomain: "event-4d869.firebaseapp.com",
  databaseURL: "https://event-4d869-default-rtdb.firebaseio.com",
  projectId: "event-4d869",
  storageBucket: "event-4d869.firebasestorage.app",
  messagingSenderId: "593013677800",
  appId: "1:593013677800:web:9abecdc378c9c7d0a7735d",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

export default function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  useEffect(() => {
    const friendsRef = ref(db, "friends");

    return onValue(friendsRef, (snapshot) => {
      if (snapshot.exists()) {
        const obj = snapshot.val();
        const arr = Object.keys(obj).map((id) => ({
          id,
          ...obj[id],
        }));
        setData(arr);
      } else {
        setData([]);
      }
    });
  }, []);

  const addFriend = () => {
    if (!name.trim() || !amount) return;

    const newRef = push(ref(db, "friends"));
    set(newRef, {
      name: name.trim(),
      amount: Number(amount),
    });

    setName("");
    setAmount("");
  };

  const updateRow = (id, key, value) => {
    update(ref(db, `friends/${id}`), {
      [key]: key === "amount" ? Number(value) || 0 : value,
    });
  };

  const removeRow = (id) => {
    remove(ref(db, `friends/${id}`));
  };

  const total = data.reduce((sum, f) => sum + f.amount, 0);
  const nameTotals = data.reduce((acc, curr) => {
    const key = curr.name?.trim();
    if (!key) return acc;

    acc[key] = (acc[key] || 0) + curr.amount;
    return acc;
  }, {});

  const nameOptions = [...new Set(data.map((d) => d.name))];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        background: "linear-gradient(135deg, #0d1f3aff, #80c582)",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            gutterBottom
            fontFamily={"emoji"}
            sx={{ color: "#850000ff" }}
          >
            Room Grocery Payment Details
          </Typography>

          <Typography
            variant="body2"
            align="center"
            fontFamily={"monospace"}
            sx={{ color: "#d4d3d379", mb: 2 }}
          >
            Developed by – Ragavan
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mb={2}>
            <Autocomplete
              freeSolo
              fullWidth
              options={nameOptions}
              value={name}
              onInputChange={(event, newValue) => setName(newValue)}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Name" fullWidth />
              )}
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
              sx={{
                minWidth: 80,
                background: "linear-gradient(135deg, #2d302bff, #80c582)",
              }}
            >
              Add
            </Button>
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <TextField
                        variant="standard"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(row.id, "name", e.target.value)
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="standard"
                        type="number"
                        value={row.amount}
                        onChange={(e) =>
                          updateRow(row.id, "amount", e.target.value)
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => {
                          setDeleteId(row.id);
                          setDeleteName(row.name);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="subtitle1"
            align="right"
            fontWeight="bold"
            sx={{ mt: 2, color: "#1f3a0d" }}
          >
            Total: ₹ {total}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography fontWeight="bold" sx={{ color: "#1f3a0d", mb: 1 }}>
              Name-wise Total
            </Typography>

            {Object.entries(nameTotals).map(([name, amount]) => (
              <Stack
                key={name}
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 0.5 }}
              >
                <Typography variant="body2">{name}</Typography>
                <Typography variant="body2" fontWeight="bold">
                  ₹ {amount}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Paper>
        <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>

          <DialogContent>
            <Typography>
              Are you sure you want to delete <b>{deleteName}</b>?
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>

            <Button
              color="error"
              variant="contained"
              onClick={() => {
                removeRow(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
