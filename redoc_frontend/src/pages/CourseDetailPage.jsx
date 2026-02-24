import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import useCourseStore from '../store/courseStore';
import useEnrollmentStore from '../store/enrollmentStore';
import { reviewService } from '../services/reviewService';
import { DIFFICULTY_LABELS } from '../utils/constants';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuth();
  const { currentCourse, loading, fetchCourseById, clearCurrent } = useCourseStore();
  const { currentEnrollment, enroll, drop, getStatus } = useEnrollmentStore();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseById(id);
    getStatus(id);
    loadReviews();
    return () => clearCurrent();
  }, [id]);

  const loadReviews = async () => {
    try {
      const { data } = await reviewService.getCourseReviews(id);
      setReviews(data.data);
      setAvgRating(data.avgRating || 0);
    } catch { /* ignore */ }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enroll(id);
      await getStatus(id);
      toast.success('Te has inscrito exitosamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al inscribirse');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDrop = async () => {
    try {
      await drop(id);
      toast.success('Inscripción cancelada');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await reviewService.create(id, { rating: newRating, comment: newComment });
      toast.success('Review enviada');
      setNewComment('');
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar review');
    }
  };

  if (loading || !currentCourse) {
    return <div className="cd"><div className="cd-loading">Cargando curso...</div></div>;
  }

  const course = currentCourse;
  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="cd">
      <div className="cd-hero">
        <div className="cd-hero-info">
          <span className="cd-cat">{course.category?.name}</span>
          <h1>{course.title}</h1>
          <p className="cd-desc">{course.shortDescription || course.description}</p>
          <div className="cd-meta">
            <span className="cd-diff" data-diff={course.difficulty}>{DIFFICULTY_LABELS[course.difficulty]}</span>
            <span>{totalLessons} lecciones</span>
            <span>{course._count?.enrollments || 0} estudiantes</span>
            {avgRating > 0 && <span>★ {avgRating.toFixed(1)} ({course._count?.reviews || 0} reviews)</span>}
          </div>
          <div className="cd-teacher">
            <div className="cd-teacher-avatar">{course.teacher?.name?.charAt(0)}</div>
            <div>
              <strong>{course.teacher?.name}</strong>
              <span>Instructor</span>
            </div>
          </div>
        </div>
        <div className="cd-hero-action">
          {currentEnrollment ? (
            <div className="cd-enrolled">
              <div className="cd-progress-bar">
                <div className="cd-progress-fill" style={{ width: `${currentEnrollment.progress}%` }} />
              </div>
              <p>{Math.round(currentEnrollment.progress)}% completado</p>
              <button className="cd-btn cd-btn--primary" onClick={() => navigate(`/courses/${id}/learn`)}>
                Continuar curso
              </button>
              <button className="cd-btn cd-btn--outline" onClick={handleDrop}>
                Cancelar inscripción
              </button>
            </div>
          ) : (
            !isTeacher && (
              <button className="cd-btn cd-btn--primary cd-btn--large" onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? 'Inscribiendo...' : 'Inscribirse gratis'}
              </button>
            )
          )}
          {isTeacher && course.teacherId === user?.id && (
            <button className="cd-btn cd-btn--outline" onClick={() => navigate(`/teacher/courses/${id}/edit`)}>
              Editar curso
            </button>
          )}
        </div>
      </div>

      <div className="cd-content">
        <div className="cd-main">
          <section className="cd-section">
            <h2>Descripción</h2>
            <p>{course.description}</p>
            {course.tags?.length > 0 && (
              <div className="cd-tags">
                {course.tags.map((tag, i) => <span key={i} className="cd-tag">{tag}</span>)}
              </div>
            )}
          </section>

          <section className="cd-section">
            <h2>Contenido del curso</h2>
            <p className="cd-section-sub">{course.modules?.length || 0} módulos · {totalLessons} lecciones</p>
            <div className="cd-modules">
              {course.modules?.map((mod) => (
                <details key={mod.id} className="cd-module">
                  <summary>
                    <span className="cd-module-title">{mod.title}</span>
                    <span className="cd-module-count">{mod.lessons?.length || 0} lecciones</span>
                  </summary>
                  <ul className="cd-lessons">
                    {mod.lessons?.map((lesson) => (
                      <li key={lesson.id} className="cd-lesson">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        <span>{lesson.title}</span>
                        {lesson.isFree && <span className="cd-lesson-free">Gratis</span>}
                        {lesson.duration > 0 && <span className="cd-lesson-dur">{lesson.duration} min</span>}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>

          <section className="cd-section">
            <h2>Reviews ({reviews.length})</h2>
            {currentEnrollment && (
              <form className="cd-review-form" onSubmit={handleReview}>
                <div className="cd-review-stars">
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} type="button" className={`cd-star ${newRating >= star ? 'cd-star--active' : ''}`} onClick={() => setNewRating(star)}>★</button>
                  ))}
                </div>
                <textarea placeholder="Escribe tu opinión..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} />
                <button type="submit" className="cd-btn cd-btn--primary">Enviar review</button>
              </form>
            )}
            <div className="cd-reviews">
              {reviews.map((review) => (
                <div key={review.id} className="cd-review">
                  <div className="cd-review-head">
                    <div className="cd-review-user">
                      <div className="cd-review-avatar">{review.user?.name?.charAt(0)}</div>
                      <strong>{review.user?.name}</strong>
                    </div>
                    <div className="cd-review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  </div>
                  {review.comment && <p>{review.comment}</p>}
                </div>
              ))}
              {reviews.length === 0 && <p className="cd-no-reviews">No hay reviews aún</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
