import dbConnect from "@/utils/dbConnect";
import Employee from "@/models/payroll/Employee";
import Activity from "@/models/Activity";

export async function getServerSideProps({ params }) {
  await dbConnect();

  const employee = await Employee.findById(params.id).lean();
  const activity = await Activity.find({ employeeEmail: employee.email }).sort({ timestamp: -1 }).lean();

  return {
    props: {
      employee: JSON.parse(JSON.stringify(employee)),
      activity: JSON.parse(JSON.stringify(activity)),
    },
  };
}

export default function ActivityPage({ employee, activity }) {
  return (
    <div className="container mt-4">
      <h2>{employee.name} - Activity Log</h2>
      {activity.length === 0 ? (
        <p>No activity found.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>URL</th>
              <th>Title</th>
              <th>Time Spent (sec)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((a, i) => (
              <tr key={i}>
                <td><a href={a.url} target="_blank">{a.url}</a></td>
                <td>{a.title}</td>
                <td>{Math.floor(a.timeSpent / 1000)}</td>
                <td>{new Date(a.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
