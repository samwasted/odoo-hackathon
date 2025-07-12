'use client'

import { useEffect, useState } from 'react'
import { getUserById, updateUserProfile } from '@/data/user'
import { Skill, Availability } from '@/generated/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Icons } from '../ui/Icons'
import Image from 'next/image'

const skills: Skill[] = Object.values(Skill)

export default function ProfilePage() {
  const user = useCurrentUser()
  const [isEditing, setIsEditing] = useState(false)

  const [form, setForm] = useState({
    name: '',
    location: '',
    skillsOffered: [] as Skill[],
    availability: 'WEEKDAYS' as Availability,
    isPublic: true,
  })

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return
      const fullUser = await getUserById(user.id)
      if (fullUser) {
        setForm({
          name: fullUser.name || '',
          location: fullUser.location || '',
          skillsOffered: fullUser.skillsOffered || [],
          availability: fullUser.availability || 'WEEKDAYS',
          isPublic: fullUser.isPublic,
        })
      }
    }
    fetchUser()
  }, [user])

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSkill = (skill: Skill) => {
    setForm((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.includes(skill)
        ? prev.skillsOffered.filter((s) => s !== skill)
        : [...prev.skillsOffered, skill],
    }))
  }

  const handleSave = async () => {
    if (!user?.id) return
    await updateUserProfile(user.id, form)
    alert('Profile updated')
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="w-full max-w-6xl mx-auto px-4">

      <Card className="w-full shadow-md rounded-xl bg-white">

        <CardContent className="flex flex-col md:flex-row gap-6 p-6 items-start">
          <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
            <Avatar className="w-32 h-32">
              {user?.image ? (
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={user.image}
                    alt="profile picture"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <AvatarFallback>
                  <Icons.user className="h-6 w-6 text-zinc-700" />
                </AvatarFallback>
              )}
            </Avatar>
            <p className="text-center font-medium">{user?.name || 'Anonymous'}</p>
            <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
                className="flex flex-col gap-4"
              >
                <div>
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Skills Offered</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {skills.map((skill) => (
                      <Button
                        type="button"
                        key={skill}
                        variant={
                          form.skillsOffered.includes(skill) ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Availability</Label>
                  <select
                    value={form.availability}
                    onChange={(e) =>
                      handleChange('availability', e.target.value as Availability)
                    }
                    className="w-full mt-1 border rounded px-2 py-1"
                  >
                    <option value="WEEKDAYS">Weekdays</option>
                    <option value="WEEKENDS">Weekends</option>
                    <option value="ALL_WEEK">All Week</option>
                  </select>
                </div>
                <div>
                  <Label>Profile Visibility</Label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={form.isPublic}
                        onChange={() => handleChange('isPublic', true)}
                      />
                      Public
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!form.isPublic}
                        onChange={() => handleChange('isPublic', false)}
                      />
                      Private
                    </label>
                  </div>
                </div>

                <Button type="submit" className="mt-4">
                  Save
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p><strong>Name:</strong> {form.name}</p>
                <p><strong>Location:</strong> {form.location}</p>
                <p><strong>Skills Offered:</strong> {form.skillsOffered.join(', ') || 'None'}</p>
                <p><strong>Availability:</strong> {form.availability}</p>
                <p><strong>Visibility:</strong> {form.isPublic ? 'Public' : 'Private'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}