import React, { useEffect, useMemo, useState } from "react";
import API from "../../api/api";

const animationStyles = `
  .animate-fade-in { animation: fadeIn 0.5s; }
  .animate-pop { animation: popIn 0.3s; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
  @keyframes popIn { 0% { transform: scale(0.95); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
`;

const getCategoryValue = (category) => category?.value || category?.name || category;
const getCategoryLabel = (category) => category?.label || getCategoryValue(category);
const UNASSIGNED_DEPARTMENT = "__unassigned__";
const UNASSIGNED_DEPARTMENT_LABEL = "Department not assigned";

export default function ListOfExams() {
  const [exams, setExams] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [examResponse, categoryResponse] = await Promise.all([
          API.get("/admin/exams"),
          API.get("/resources/categories").catch(() => ({ data: [] })),
        ]);

        if (!mounted) return;
        const loadedExams = Array.isArray(examResponse.data) ? examResponse.data : [];
        const loadedCategories = Array.isArray(categoryResponse.data) ? categoryResponse.data : [];

        const categoriesByValue = new Map();
        loadedCategories.forEach((category) => {
          const value = getCategoryValue(category);
          if (value) categoriesByValue.set(value, category);
        });
        loadedExams.forEach((exam) => {
          if (exam.category && !categoriesByValue.has(exam.category)) {
            categoriesByValue.set(exam.category, { value: exam.category, label: exam.category });
          }
        });

        setExams(loadedExams);
        setCategoryOptions(Array.from(categoriesByValue.values()));
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load exams.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const isExitCategory = selectedCategory.toLowerCase() === "exit";

  const categoryCards = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categoryOptions
      .map((category) => {
        const value = getCategoryValue(category);
        return {
          value,
          label: getCategoryLabel(category),
          count: exams.filter((exam) => exam.category === value).length,
        };
      })
      .filter(
        (category) =>
          category.value &&
          category.count > 0 &&
          category.label?.toLowerCase().includes(query)
      );
  }, [categoryOptions, exams, search]);

  const departmentCards = useMemo(() => {
    const query = search.trim().toLowerCase();
    const departments = new Map();

    exams
      .filter((exam) => exam.category === selectedCategory && exam.department)
      .forEach((exam) => {
        const department = exam.department.trim();
        if (department) departments.set(department, (departments.get(department) || 0) + 1);
      });

    exams
      .filter((exam) => exam.category === selectedCategory && !exam.department?.trim())
      .forEach(() => {
        departments.set(
          UNASSIGNED_DEPARTMENT,
          (departments.get(UNASSIGNED_DEPARTMENT) || 0) + 1
        );
      });

    return Array.from(departments.entries())
      .map(([name, count]) => ({
        name,
        label: name === UNASSIGNED_DEPARTMENT ? UNASSIGNED_DEPARTMENT_LABEL : name,
        count,
      }))
      .filter((department) => department.label.toLowerCase().includes(query));
  }, [exams, search, selectedCategory]);

  const visibleExams = useMemo(() => {
    const query = search.trim().toLowerCase();
    return exams.filter((exam) => {
      if (exam.category !== selectedCategory) return false;
      const departmentKey = exam.department?.trim() || UNASSIGNED_DEPARTMENT;
      if (isExitCategory && departmentKey !== selectedDepartment) return false;
      return (
        exam.title?.toLowerCase().includes(query) ||
        exam.category?.toLowerCase().includes(query) ||
        exam.department?.toLowerCase().includes(query)
      );
    });
  }, [exams, isExitCategory, search, selectedCategory, selectedDepartment]);

  const pageTitle = !selectedCategory
    ? "Exam Categories"
    : isExitCategory && !selectedDepartment
      ? "Exit Exam Departments"
      : `${selectedCategory} Exams`;

  const goBack = () => {
    if (isExitCategory && selectedDepartment) {
      setSelectedDepartment("");
      setSearch("");
      return;
    }
    setSelectedCategory("");
    setSelectedDepartment("");
    setSearch("");
  };

  const renderExamCards = () => (
    visibleExams.length === 0 ? (
      <div className="text-gray-600">No exams found{search ? " matching your search" : ""}.</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleExams.map((exam, index) => (
          <div
            key={exam._id}
            className="p-6 border-2 border-indigo-100 rounded-2xl bg-white shadow-xl flex flex-col justify-between animate-pop hover:shadow-2xl hover:border-teal-300 transition-all duration-200"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div>
              <div className="font-bold text-lg text-indigo-700 mb-1 truncate">{exam.title}</div>
              <div className="text-sm text-gray-500 mb-2">
                Category: <span className="font-semibold text-indigo-600">{exam.category || "—"}</span>
              </div>
              {isExitCategory && (
                <div className="text-sm text-gray-500 mb-2">
                  Department: <span className="font-semibold text-indigo-600">{exam.department || "—"}</span>
                </div>
              )}
              <div className="text-xs text-gray-400 mb-4">
                Duration: <span className="font-semibold">{exam.duration ? `${exam.duration} min` : "—"}</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-auto bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-5 py-2 rounded-lg shadow-md font-semibold text-base hover:scale-105 active:scale-100 transition-transform duration-150"
              onClick={() => window.location.href = `/exam/${exam._id}`}
            >
              Start
            </button>
          </div>
        ))}
      </div>
    )
  );

  return (
    <>
      <style>{animationStyles}</style>
      <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-teal-50 shadow-2xl rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            {selectedCategory && (
              <button
                type="button"
                onClick={goBack}
                className="border border-teal-200 text-teal-700 px-3 py-2 rounded-lg hover:bg-teal-50 transition"
              >
                ← Back
              </button>
            )}
            <h2 className="text-3xl font-extrabold text-teal-700 drop-shadow-sm tracking-tight">{pageTitle}</h2>
          </div>
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={!selectedCategory ? "Search categories…" : isExitCategory && !selectedDepartment ? "Search departments…" : "Search exams…"}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-8 py-2 border-2 border-teal-100 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-300 text-gray-700 text-sm transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading exams…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !selectedCategory ? (
          categoryCards.length === 0 ? (
            <div className="text-gray-600">No exam categories found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categoryCards.map((category, index) => (
                <button
                  type="button"
                  key={category.value}
                  onClick={() => { setSelectedCategory(category.value); setSearch(""); }}
                  className="text-left p-6 border-2 border-indigo-100 rounded-2xl bg-white shadow-xl animate-pop hover:shadow-2xl hover:border-teal-300 transition-all duration-200"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="font-bold text-xl text-indigo-700 mb-2">{category.label}</div>
                  <div className="text-sm text-gray-500">
                    {category.count} {category.count === 1 ? "exam" : "exams"}
                  </div>
                  <div className="text-teal-600 font-semibold mt-4">View exams →</div>
                </button>
              ))}
            </div>
          )
        ) : isExitCategory && !selectedDepartment ? (
          departmentCards.length === 0 ? (
            <div className="text-gray-600">No Exit exam departments found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {departmentCards.map((department, index) => (
                <button
                  type="button"
                  key={department.name}
                  onClick={() => { setSelectedDepartment(department.name); setSearch(""); }}
                  className="text-left p-6 border-2 border-indigo-100 rounded-2xl bg-white shadow-xl animate-pop hover:shadow-2xl hover:border-teal-300 transition-all duration-200"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="font-bold text-xl text-indigo-700 mb-2">{department.label}</div>
                  <div className="text-sm text-gray-500">
                    {department.count} {department.count === 1 ? "exam" : "exams"}
                  </div>
                  <div className="text-teal-600 font-semibold mt-4">View exams →</div>
                </button>
              ))}
            </div>
          )
        ) : (
          renderExamCards()
        )}
      </div>
    </>
  );
}