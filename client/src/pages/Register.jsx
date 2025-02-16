import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/forms/Input';
import Button from '../components/ui/Button';
import { getRandomAvatar } from '../utils/avatars';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('parent');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    contact: '',
    adresse: '',
    photo: 'default-avatar.png',
    role: 'parent',
    // Babysitter specific fields
    tarif: '',
    experience: '',
    competances: '',
    languages: '',
    bio: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      const userData = {
        ...formData,
        age: parseInt(formData.age),
        photo: getRandomAvatar(formData.role),
        ...(formData.role === 'babysitter' && {
          tarif: parseFloat(formData.tarif) || 0,
          experience: parseInt(formData.experience) || 0,
          competances: formData.competances.length ? formData.competances.split(',').map(s => s.trim()) : [],
          disponibilite: true,
          languages: formData.languages ? formData.languages.split(',').map(s => s.trim()) : [],
          certifications: [],
          bio: formData.bio || ''
        })
      };

      console.log('Submitting registration data:', userData);
      
      const response = await signUp(userData);
      
      if (response.success) {
        navigate(formData.role === 'babysitter' ? '/babysitter-dashboard' : '/parent-dashboard');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error details:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Update role in formData when role changes
      ...(name === 'role' && { role: value })
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
        {/* Top - Image */}
        <div className="w-full max-w-md mb-8">
          <img
            src="/images/register.jpg"
            alt="Register"
            className="w-full h-[300px] object-contain rounded-lg shadow-xl"
            onError={(e) => console.error('Image failed to load:', e)}
          />
        </div>

        {/* Bottom - Register Form */}
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  sign in to your account
                </Link>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Basic Info */}
                <Input
                  label="Name"
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
                  value={formData.age}
                  onChange={handleChange}
                />

                <Input
                  label="Contact"
                  name="contact"
                  type="text"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="parent">Parent</option>
                    <option value="babysitter">Babysitter</option>
                  </select>
                </div>
              </div>

              {/* Babysitter-specific fields */}
              {formData.role === 'babysitter' && (
                <div className="space-y-4 border-t pt-4">
                  <Input
                    label="Hourly Rate ($)"
                    name="tarif"
                    type="number"
                    value={formData.tarif}
                    onChange={handleChange}
                  />

                  <Input
                    label="Years of Experience"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="competances"
                      value={formData.competances}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="First aid, CPR, Early childhood education"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Languages (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="English, French, Arabic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
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
      </div>
    </div>
  );
} 