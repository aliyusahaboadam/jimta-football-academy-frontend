import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Dialog, DialogActions, IconButton, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import dashboard from "../style/Dashboard.module.css";

const CoachActionMenu = ({ row, onDelete, onEdit, onView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
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

  const fullName =
    [row.firstname, row.surname].filter(Boolean).join(" ") || "this coach";

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="action-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon sx={{ fontSize: 30 }} />
      </IconButton>

      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "long-button" }}
        slotProps={{
          paper: {
            style: {
              borderRadius: "8px",
              boxShadow: "0 0 20px 10px #f3f3f3",
            },
          },
        }}
      >
        <MenuItem style={{ fontSize: 17 }} onClick={handleEdit}>
          Edit
        </MenuItem>
        <MenuItem style={{ fontSize: 17 }} onClick={handleViewDetails}>
          Details
        </MenuItem>
        <MenuItem style={{ fontSize: 17 }} onClick={handleDeleteClick}>
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        BackdropProps={{
          sx: { backgroundColor: "rgba(215, 27, 59, 0.2)" },
        }}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
            borderRadius: "15px",
          },
        }}
      >
        <div
          style={{ width: "100%", background: "#fff" }}
          className={dashboard["card--alert-error"]}
        >
          <div className={dashboard["card_body"]}>
            <span className={dashboard["icon-container"]}>
              <svg
                className={[
                  dashboard["icon--big"],
                  dashboard["icon--error"],
                ].join(" ")}
              >
                <use href="/images/sprite.svg#error-icon"></use>
              </svg>
            </span>

            <Typography
              sx={{ fontSize: 20, color: "#9a99ac", marginTop: "1rem" }}
            >
              <p className={dashboard["alert-message"]}>
                Are you sure you want to delete {fullName}?
              </p>
            </Typography>
          </div>
        </div>

        <DialogActions
          style={{
            padding: "1.5rem 3rem 1.5rem 3rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            style={{ fontSize: 15 }}
            onClick={handleCancelDelete}
            sx={{
              borderRadius: "15px",
              color: "#fff",
              backgroundColor: "#388E3C",
              "&:hover": { backgroundColor: "#2f7533" },
            }}
          >
            Cancel
          </Button>
          <Button
            style={{ fontSize: 15 }}
            onClick={handleConfirmDelete}
            sx={{
              borderRadius: "15px",
              color: "#fff",
              backgroundColor: "#F44336",
              "&:hover": { backgroundColor: "#bd3228" },
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CoachActionMenu;