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

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);

  // Load data from Firebase on mount
  useEffect(() => {
    const friendsRef = ref(db, "friends");
    onValue(friendsRef, (snapshot) => {
      const val = snapshot.val();
      setData(val ? Object.values(val) : []);
    });
  }, []);

  // Save data to Firebase
  const saveData = (newData) => {
    set(ref(db, "friends"), newData);
  };

  const addFriend = () => {
    if (!name.trim() || !amount) return;
    const newFriend = { name: name.trim(), amount: Number(amount) };
    const newData = [...data, newFriend];
    saveData(newData);
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
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Typography
  variant="h5"
  fontWeight="bold"
  gutterBottom
  align="center"
  fontFamily={"serif"}
  sx={{ color: "#2b680fff" }}
>
  RK Brothers - Pongal (2026)
</Typography>

<Typography
  variant="body2"
  align="center"
  fontFamily={"monospace"}
  sx={{ color: "#b5b6b271", marginTop: "-6px" }}
>
  Developed by - Ragavan
</Typography>


          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mb={2} mt={2}>
            <TextField
              size="small"
              label="Name"
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
              sx={{
                minWidth: 80,
                background: "linear-gradient(135deg, #1f3a0d, #80c582)",
              }}
            >
              Add
            </Button>
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#dbe6db27" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Friend</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: "#f5f0f01e",
                      "&:hover": { backgroundColor: "#f3e9f357" },
                    }}
                  >
                    <TableCell>
                      <TextField
                        variant="standard"
                        size="small"
                        value={row.name}
                        onChange={(e) => update(index, "name", e.target.value)}
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
