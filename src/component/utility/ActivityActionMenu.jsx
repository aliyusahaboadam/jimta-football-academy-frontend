import { Delete, Edit, Info, MoreVert } from "@mui/icons-material";
import { Button, Dialog, DialogActions, IconButton, Typography } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import dashboard from "../style/Dashboard.module.css";

const ActivityActionMenu = ({ row, onDelete, onEdit, onView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();          // prevent card onClick
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleClose();
  };
  const handleConfirmDelete = () => {
    onDelete(row.id);
    setDeleteDialogOpen(false);
  };
  const handleCancelDelete = () => setDeleteDialogOpen(false);

  const handleEdit = () => {
    onEdit(row.id);
    handleClose();
  };
  const handleViewDetails = () => {
    onView(row.id);
    handleClose();
  };

  return (
    <>
      {/* Small floating pill in the card's top-right corner */}
      <IconButton
        aria-label="Activity actions"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
        className={dashboard["activity__menuBtn"]}
      >
        <MoreVert sx={{ fontSize: 18 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "10px",
              boxShadow: "0 4px 24px rgba(14,56,122,0.15)",
              minWidth: 160,
              mt: 0.5,
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit} dense>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleViewDetails} dense>
          <ListItemIcon><Info fontSize="small" /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} dense sx={{ color: "#F44336" }}>
          <ListItemIcon><Delete fontSize="small" sx={{ color: "#F44336" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14 }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog — unchanged, but tightened up */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onClick={(e) => e.stopPropagation()}
        BackdropProps={{ sx: { backgroundColor: "rgba(215, 27, 59, 0.2)" } }}
        sx={{ "& .MuiDialog-paper": { width: "100%", maxWidth: 420, borderRadius: "15px" } }}
      >
        <div className={dashboard["card--alert-error"]}>
          <div className={dashboard["card_body"]}>
            <span className={dashboard["icon-container"]}>
              <svg className={[dashboard["icon--big"], dashboard["icon--error"]].join(" ")}>
                <use href="/images/sprite.svg#error-icon"></use>
              </svg>
            </span>
            <Typography sx={{ fontSize: 18, color: "#9a99ac", marginTop: "1rem", textAlign: "center" }}>
              Are you sure you want to delete <strong>"{row.title}"</strong>?
            </Typography>
          </div>
        </div>

        <DialogActions
          sx={{
            padding: "1rem 1.5rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Button
            onClick={handleCancelDelete}
            variant="contained"
            sx={{
              borderRadius: "10px",
              backgroundColor: "#388E3C",
              textTransform: "none",
              fontSize: 14,
              "&:hover": { backgroundColor: "#2f7533" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            autoFocus
            sx={{
              borderRadius: "10px",
              backgroundColor: "#F44336",
              textTransform: "none",
              fontSize: 14,
              "&:hover": { backgroundColor: "#bd3228" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivityActionMenu;