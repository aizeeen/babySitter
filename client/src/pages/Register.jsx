import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/forms/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    contact: '',
    adresse: '',
    photo: '',
    role: 'parent',
    tarif: '',
    experience: '',
    competances: [],
    disponibilite: true,
    certifications: [],
    languages: [],
    bio: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      const dataToSubmit = {
        ...formData,
        age: parseInt(formData.age),
        ...(formData.role === 'babysitter' && {
          tarif: parseFloat(formData.tarif) || 0,
          experience: parseInt(formData.experience) || 0,
          competances: formData.competances || []
        })
      };

      const response = await signUp(dataToSubmit);
      
      // Redirect based on role
      if (response.user.role === 'babysitter') {
        navigate('/babysitter-dashboard');
      } else {
        navigate('/parent-dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="flex justify-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="parent"
                checked={formData.role === 'parent'}
                onChange={handleChange}
                className="form-radio text-primary-600"
              />
              <span className="ml-2">Parent</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="babysitter"
                checked={formData.role === 'babysitter'}
                onChange={handleChange}
                className="form-radio text-primary-600"
              />
              <span className="ml-2">Babysitter</span>
            </label>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Full Name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Age"
              name="age"
              type="number"
              required
              min="18"
              value={formData.age}
              onChange={handleChange}
            />

            <Input
              label="Contact Number"
              name="contact"
              type="tel"
              required
              value={formData.contact}
              onChange={handleChange}
            />

            <Input
              label="Address"
              name="adresse"
              type="text"
              required
              value={formData.adresse}
              onChange={handleChange}
            />

            <Input
              label="Photo URL"
              name="photo"
              type="url"
              value={formData.photo}
              onChange={handleChange}
              placeholder="http://example.com/photo.jpg"
            />
          </div>

          {/* Babysitter-specific Fields */}
          {formData.role === 'babysitter' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Hourly Rate ($)"
                  name="tarif"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.tarif}
                  onChange={handleChange}
                />

                <Input
                  label="Years of Experience"
                  name="experience"
                  type="number"
                  min="0"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <input
                  type="text"
                  name="competances"
                  value={formData.competances.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    competances: e.target.value.split(',').map(skill => skill.trim())
                  }))}
                  placeholder="First Aid, Child Care, etc. (comma-separated)"
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Languages</label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    languages: e.target.value.split(',').map(lang => lang.trim())
                  }))}
                  placeholder="English, French, etc. (comma-separated)"
                  className="mt-1 block w-full rounded-md border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="disponibilite"
                  name="disponibilite"
                  checked={formData.disponibilite}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    disponibilite: e.target.checked
                  }))}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <label htmlFor="disponibilite" className="ml-2 block text-sm text-gray-900">
                  Available for bookings
                </label>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
} 