export default function AccountInfo() {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Account Information</h2>
      <div className='mb-4'>
        <p>
          <strong>Name:</strong> John Doe
        </p>
        <p>
          <strong>Email:</strong> john.doe@example.com
        </p>
        <p>
          <strong>Phone:</strong> +1 (555) 123-4567
        </p>
      </div>
      <div className='mb-4'>
        <h3 className='text-xl font-semibold mb-2'>Address</h3>
        <p>123 Main Street</p>
        <p>Anytown, ST 12345</p>
        <p>United States</p>
      </div>
      <div>
        <h3 className='text-xl font-semibold mb-2'>Security</h3>
        <p>
          <strong>Last Password Change:</strong> 3 months ago
        </p>
      </div>
    </div>
  )
}
