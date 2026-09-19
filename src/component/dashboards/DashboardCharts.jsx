import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { getAllCoaches } from "../../redux/reducer/coachSlice";
import { getAllMatches } from "../../redux/reducer/matchSlice";
import { getAllPlayers } from "../../redux/reducer/playerSlice";
import { getAllTeamsWithPlayerCount } from "../../redux/reducer/teamSlice";
import dashboard from "../style/Dashboard.module.css";

const PALETTE = [
  "#A52A2A", // Brown
  "#800020", // Burgundy
  "#6E260E", // Burnt Umber
  "#CC5500", // Burnt Orange
  "#E97451", // Burnt Sienna
];

const legendStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#9a99ac",
  fontFamily: "Roboto",
  margin: "0px",
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartCard = ({ title, data, tooltipLabel, unit }) => {
  const isEmpty =
    !data ||
    data.length === 0 ||
    data.every((item) => !item.value || item.value === 0);

  const total = isEmpty
    ? 0
    : data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className={dashboard["chart__card"]}>
      <h2 className={dashboard["chart__title"]}>{title}</h2>

      {isEmpty ? (
        <div className={dashboard["chart__empty"]}>
          <p>No data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, tooltipLabel]} />
            <Legend wrapperStyle={legendStyle} />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className={dashboard["chart__total"]}>
        <p>
          Total {unit || tooltipLabel}: {total}
        </p>
      </div>
    </div>
  );
};

const DashboardCharts = ({ role = "admin" }) => {
  const dispatch = useDispatch();

  const playerState = useSelector((state) => state.players);
  const { players } = playerState;
  const playerList = Array.isArray(players) ? players : [];

  const coachState = useSelector((state) => state.coaches);
  const { coaches } = coachState;
  const coachList = Array.isArray(coaches) ? coaches : [];

  const teamState = useSelector((state) => state.teams);
  const { teams } = teamState;
  const teamList = Array.isArray(teams) ? teams : [];

  const matchState = useSelector((state) => state.matches);
  const { matches } = matchState;
  const matchList = Array.isArray(matches) ? matches : [];

  useEffect(() => {
    if (role === "admin") {
      dispatch(getAllPlayers());
      dispatch(getAllCoaches());
      dispatch(getAllTeamsWithPlayerCount());
      dispatch(getAllMatches());
    }
  }, [dispatch, role]);

  // -------- Admin datasets --------
  const malePlayers = playerList.filter(
    (p) => (p?.gender || p?.profile?.gender || "").toLowerCase() === "male"
  ).length;
  const femalePlayers = playerList.filter(
    (p) => (p?.gender || p?.profile?.gender || "").toLowerCase() === "female"
  ).length;

  const ageGroupMap = {};
  teamList.forEach((t) => {
    const key = t.ageGroup || "Unassigned";
    ageGroupMap[key] = (ageGroupMap[key] || 0) + 1;
  });

  const statusMap = {};
  matchList.forEach((m) => {
    const key = (m.status || "UNKNOWN").toUpperCase();
    statusMap[key] = (statusMap[key] || 0) + 1;
  });

  // -------- Coach datasets --------
  const coachMatchesByStatus = {};
  matchList.forEach((m) => {
    const key = (m.status || "UNKNOWN").toUpperCase();
    coachMatchesByStatus[key] = (coachMatchesByStatus[key] || 0) + 1;
  });

  // -------- Player datasets --------
  const playerMatchesByStatus = {};
  matchList.forEach((m) => {
    const key = (m.status || "UNKNOWN").toUpperCase();
    playerMatchesByStatus[key] = (playerMatchesByStatus[key] || 0) + 1;
  });

  const buildSlices = (map) =>
    Object.entries(map).map(([name, value], i) => ({
      name,
      value,
      color: PALETTE[i % PALETTE.length],
    }));

  let genderData = [];
  let secondaryData = [];
  let tertiaryData = null;

  if (role === "admin") {
    genderData = [
      { name: "Male", value: malePlayers, color: PALETTE[0] },
      { name: "Female", value: femalePlayers, color: PALETTE[1] },
    ];
    secondaryData = buildSlices(ageGroupMap);
    tertiaryData = buildSlices(statusMap);
  } else if (role === "coach") {
    genderData = [
      { name: "Players in My Team", value: playerList.length, color: PALETTE[0] },
    ];
    secondaryData = buildSlices(coachMatchesByStatus);
  } else {
    genderData = [
      { name: "My Team Size", value: playerList.length, color: PALETTE[0] },
    ];
    secondaryData = buildSlices(playerMatchesByStatus);
  }

  const charts = [
    {
      title:
        role === "admin"
          ? "Players by Gender"
          : role === "coach"
          ? "My Team Size"
          : "My Team Size",
      data: genderData,
      tooltipLabel: "Players",
      unit: "Players",
    },
    {
      title:
        role === "admin"
          ? "Teams by Age Group"
          : role === "coach"
          ? "My Matches by Status"
          : "My Matches by Status",
      data: secondaryData,
      tooltipLabel: role === "admin" ? "Teams" : "Matches",
      unit: role === "admin" ? "Teams" : "Matches",
    },
  ];

  if (tertiaryData !== null) {
    charts.push({
      title: "Matches by Status",
      data: tertiaryData,
      tooltipLabel: "Matches",
      unit: "Matches",
    });
  }

  const gridClass =
    role === "admin" ? dashboard["grid--1x3"] : dashboard["grid--1x2"];

  return (
    <section className={dashboard["chart__wrapper"]}>
      <h2 className={dashboard["chart__heading"]}>Overview</h2>
      <div className={[dashboard["grid"], gridClass].join(" ")}>
        {charts.map((c) => (
          <ChartCard
            key={c.title}
            title={c.title}
            data={c.data}
            tooltipLabel={c.tooltipLabel}
            unit={c.unit}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardCharts;