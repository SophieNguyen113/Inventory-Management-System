import { RiDashboardLine } from "react-icons/ri";
import { MdPlaylistAdd } from "react-icons/md";
import { FaRegAddressBook } from "react-icons/fa";
import { TbMessageReport } from "react-icons/tb";


const menu = [
  {
    title: "Dashboard",
    icon: <RiDashboardLine color = "purple" />,
    path: "/dashboard",
  },
  {
    title: "Add Product",
    icon: <MdPlaylistAdd color = "green" />,
    path: "/add-product",
  },
  {
    title: "Account",
    icon: <FaRegAddressBook color = "blue" />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "Report Bug",
    icon: <TbMessageReport color = "red" />,
    path: "/contact-us",
  },
];

export default menu;
