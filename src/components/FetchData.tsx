"use client";

import { Admission } from "@/lib/types";
import ky from "ky";
import { useEffect, useState } from "react";

const FetchData = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAdmissions = async () => {
      try {
        const response = await ky.get("/api/admission").json<{
          success: boolean;
          data: Admission[];
          message?: string;
        }>();

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch data");
        }

        setAdmissions(response.data);
      } catch (error) {
        console.error(error);
        setError("Admission data load করা যায়নি।");
      } finally {
        setLoading(false);
      }
    };

    getAdmissions();
  }, []);

  if (loading) {
    return (
      <section className="grid h-dvh place-items-center">
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="grid h-dvh place-items-center">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="h-dvh overflow-auto p-6">
      <div className="min-w-max">
        <table className="border-collapse border">
          <thead>
            <tr>
              <th className="border p-3">Timestamp</th>
              <th className="border p-3">Full Name</th>
              <th className="border p-3">Father Name</th>
              <th className="border p-3">Gender</th>
              <th className="border p-3">Date of Birth</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Phone</th>
              <th className="border p-3">WhatsApp</th>
              <th className="border p-3">Aadhaar</th>
              <th className="border p-3">Last Qualification</th>
              <th className="border p-3">Address</th>
              <th className="border p-3">Course</th>
              <th className="border p-3">Duration</th>
              <th className="border p-3">Terms Accepted</th>
            </tr>
          </thead>

          <tbody>
            {admissions.map((admission, index) => (
              <tr key={index}>
                <td className="border p-3">{admission.Timestamp}</td>
                <td className="border p-3">{admission["Full Name"]}</td>
                <td className="border p-3">{admission["Father Name"]}</td>
                <td className="border p-3">{admission.Gender}</td>
                <td className="border p-3">{admission["Date of Birth"]}</td>
                <td className="border p-3">{admission.Email}</td>
                <td className="border p-3">{admission.Phone}</td>
                <td className="border p-3">{admission.WhatsApp}</td>
                <td className="border p-3">{admission.Aadhaar}</td>
                <td className="border p-3">
                  {admission["Last Qualification"]}
                </td>
                <td className="border p-3">{admission.Address}</td>
                <td className="border p-3">{admission.Course}</td>
                <td className="border p-3">{admission.Duration}</td>
                <td className="border p-3">
                  {admission["Terms Accepted"] ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default FetchData;
