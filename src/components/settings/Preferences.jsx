export default function Preferences() {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Preferences</h2>
      <div>
        <label>
          <input type='checkbox' /> Receive email notifications
        </label>
      </div>
      <div>
        <label>
          <input type='checkbox' /> Dark mode
        </label>
      </div>
      <div>
        <label>Language: </label>
        <select>
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
    </div>
  )
}
