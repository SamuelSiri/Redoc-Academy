import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCourseStore from '../store/courseStore';
import useEnrollmentStore from '../store/enrollmentStore';
import { certificateService } from '../services/certificateService';
import './CoursePlayerPage.css';

const CoursePlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCourse, loading, fetchCourseById } = useCourseStore();
  const { currentEnrollment, getStatus, completeLesson } = useEnrollmentStore();
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    fetchCourseById(id);
    getStatus(id);
  }, [id]);

  useEffect(() => {
    if (currentCourse?.modules?.[0]?.lessons?.[0] && !activeLesson) {
      setActiveLesson(currentCourse.modules[0].lessons[0]);
    }
  }, [currentCourse]);

  const handleCompleteLesson = async (lessonId) => {
    try {
      const result = await completeLesson(lessonId);
      setCompletedLessons((prev) => new Set([...prev, lessonId]));
      toast.success('Lección completada');

      if (result.completed) {
        toast.success('¡Felicidades! Has completado el curso');
        try {
          await certificateService.generate(id);
          toast.success('Certificado generado');
        } catch { /* ignore */ }
      }
      await getStatus(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (loading || !currentCourse) {
    return <div className="cp"><div className="cp-loading">Cargando...</div></div>;
  }

  const course = currentCourse;

  return (
    <div className="cp">
      <div className="cp-header">
        <button className="cp-back" onClick={() => navigate(`/courses/${id}`)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Volver al curso
        </button>
        <h1>{course.title}</h1>
        {currentEnrollment && (
          <div className="cp-progress">
            <div className="cp-progress-bar">
              <div className="cp-progress-fill" style={{ width: `${currentEnrollment.progress}%` }} />
            </div>
            <span>{Math.round(currentEnrollment.progress)}%</span>
          </div>
        )}
      </div>

      <div className="cp-layout">
        <div className="cp-sidebar">
          {course.modules?.map((mod) => (
            <div key={mod.id} className="cp-module">
              <div className="cp-module-title">{mod.title}</div>
              <ul className="cp-lessons">
                {mod.lessons?.map((lesson) => (
                  <li
                    key={lesson.id}
                    className={`cp-lesson ${activeLesson?.id === lesson.id ? 'cp-lesson--active' : ''} ${completedLessons.has(lesson.id) ? 'cp-lesson--done' : ''}`}
                    onClick={() => setActiveLesson(lesson)}
                  >
                    <span className="cp-lesson-icon">
                      {completedLessons.has(lesson.id) ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      )}
                    </span>
                    <span className="cp-lesson-title">{lesson.title}</span>
                    {lesson.duration > 0 && <span className="cp-lesson-dur">{lesson.duration}m</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="cp-main">
          {activeLesson ? (
            <div className="cp-content">
              <h2>{activeLesson.title}</h2>
              {activeLesson.videoUrl && (
                <div className="cp-video">
                  <video controls src={activeLesson.videoUrl} />
                </div>
              )}
              {activeLesson.description && <p className="cp-lesson-desc">{activeLesson.description}</p>}
              {activeLesson.content && (
                <div className="cp-lesson-content">{activeLesson.content}</div>
              )}
              <div className="cp-actions">
                {!completedLessons.has(activeLesson.id) && (
                  <button className="cp-btn cp-btn--primary" onClick={() => handleCompleteLesson(activeLesson.id)}>
                    Marcar como completada
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="cp-empty">Selecciona una lección para comenzar</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayerPage;
