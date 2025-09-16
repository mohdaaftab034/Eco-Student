import { useState, useEffect, useCallback, useContext } from "react";
import toast from "react-hot-toast";
import { userDataContext } from "../Context/UserContext";


// ===================== Event Manager =====================
class RealtimeEventManager {
    constructor() {
        this.listeners = {};
    }

    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);

        // Return unsubscribe function
        return () => {
            this.listeners[event] = this.listeners[event].filter(
                (cb) => cb !== callback
            );
        };
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback) => callback(data));
        }
    }
}

export const realtimeEvents = new RealtimeEventManager();

// ===================== Hook =====================
export function useRealtimeUpdates(userId) {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, axios, token } = useContext(userDataContext)

    // Fetch student data
    const fetchStudent = useCallback(async () => {
        const userId = user?.user_id;   // safe check
        if (!userId) return;

        try {
            const res = await axios.get(`/api/students/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,   // same object me hona chahiye
            });

            console.log(res.data)

            if (res.data.success && res.data.student) {
                setStudent(res.data.student);

                // Emit global update event
                realtimeEvents.emit("student-updated", res.data.student);
            }
        } catch (error) {
            console.error("Failed to fetch student data:", error);
        } finally {
            setLoading(false);
        }
    }, [user?._id, token]);


    // Refresh student data
    const refreshStudent = useCallback(async () => {
        await fetchStudent();
    }, [fetchStudent]);

    // Update student points
    const updateStudentPoints = useCallback(
        async (pointsChange, reason) => {
            if (!student) return;

            try {
                const newPoints = student.eco_points + pointsChange;
                const newLevel = Math.floor(newPoints / 500) + 1;

                const res = await axios.put(
                    `/api/students/${student._id}`,
                    { eco_points: newPoints, level: newLevel }, // payload
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    }
                );


                if (res.data.success) {
                    const updatedStudent = res.data.student;
                    setStudent(updatedStudent);

                    realtimeEvents.emit("student-updated", updatedStudent);
                    realtimeEvents.emit("points-updated", {
                        student: updatedStudent,
                        change: pointsChange,
                        reason,
                    });

                    if (pointsChange > 0) {
                        toast.success(`🎉 +${pointsChange} eco points! ${reason || ""}`, {
                            duration: 3000,
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to update points:", error);
                toast.error("Failed to update points");
            }
        },
        [student]
    );

    // Update student badges
    const updateStudentBadges = useCallback(
        async (newBadges) => {
            if (!student || newBadges.length === 0) return;

            try {
                const updatedBadges = [...(student.badges || []), ...newBadges];

                const res = await axios.put(
                    `/api/students/${student._id}/badges`, { headers: { Authorization: `Bearer ${token}` } },
                    { badges: updatedBadges },
                    { withCredentials: true }
                );

                if (res.data.success) {
                    const updatedStudent = res.data.student;
                    setStudent(updatedStudent);

                    realtimeEvents.emit("student-updated", updatedStudent);
                    realtimeEvents.emit("badges-updated", {
                        student: updatedStudent,
                        newBadges,
                    });

                    newBadges.forEach((badge, index) => {
                        setTimeout(() => {
                            toast.success(`🏆 New Badge Earned! ${badge.icon} ${badge.name}`, {
                                duration: 5000,
                                style: {
                                    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                                    border: "2px solid #f59e0b",
                                    borderRadius: "12px",
                                    color: "#92400e",
                                },
                            });
                        }, index * 500);
                    });
                }
            } catch (error) {
                console.error("Failed to update badges:", error);
                toast.error("Failed to update badges");
            }
        },
        [student]
    );

    // Initial fetch
    useEffect(() => {
        if (userId) {
            fetchStudent();
        }
    }, [userId, fetchStudent]);

    // Listen for refresh events
    useEffect(() => {
        const unsubscribe = realtimeEvents.subscribe("refresh-student-data", () => {
            refreshStudent();
        });

        return unsubscribe;
    }, [refreshStudent]);

    // Polling for external changes
    useEffect(() => {
        if (!userId) return;

        const pollInterval = setInterval(() => {
            fetchStudent();
        }, 15000);

        return () => clearInterval(pollInterval);
    }, [userId, fetchStudent]);

    return {
        student,
        refreshStudent,
        updateStudentPoints,
        updateStudentBadges,
        loading,
    };
}

// ===================== Helper Hook =====================
export function useRealtimeEvents() {
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        const unsubscribeStudent = realtimeEvents.subscribe(
            "student-updated",
            (student) => {
                setLastUpdate({ type: "student", data: student, timestamp: Date.now() });
            }
        );

        const unsubscribePoints = realtimeEvents.subscribe(
            "points-updated",
            (data) => {
                setLastUpdate({ type: "points", data, timestamp: Date.now() });
            }
        );

        const unsubscribeBadges = realtimeEvents.subscribe(
            "badges-updated",
            (data) => {
                setLastUpdate({ type: "badges", data, timestamp: Date.now() });
            }
        );

        return () => {
            unsubscribeStudent();
            unsubscribePoints();
            unsubscribeBadges();
        };
    }, []);

    const triggerRefresh = useCallback(() => {
        realtimeEvents.emit("refresh-student-data");
    }, []);

    return { lastUpdate, triggerRefresh };
}
