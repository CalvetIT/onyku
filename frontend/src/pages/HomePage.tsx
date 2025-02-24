export function HomePage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ marginBottom: '20px' }}>Onyky™'s proof of concept for the knowledge sharing module</h1>
            
            <p style={{ marginBottom: '20px' }}>
                Welcome to Onyky™. With this POC, you can create and share knowledge or import existing IT consulting knowledge seamlessly.
            </p>

            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '15px' }}>
                    <strong>Libraries:</strong> Create and edit libraries. Knowledge is shared on a per-library basis, 
                    with one Git repository per library.
                </li>

                <li style={{ marginBottom: '15px' }}>
                    <strong>Subjects:</strong> Create one or more subjects per library. Ubiquitous language is mandatory 
                    within each subject, similar to Domain-Driven Design.
                </li>

                <li style={{ marginBottom: '15px' }}>
                    <strong>IT Design Question Guideline:</strong> Share your thoughts on specific design questions and 
                    considerations for all potential answers. Onyky™ aims to establish guideline standards for IT 
                    consulting knowledge sharing. "IT Design Question Guideline" is the first version of one guideline 
                    standard, similar to how the "design pattern" format contributes to knowledge sharing among IT 
                    software professionals.
                </li>

                <li style={{ marginBottom: '15px' }}>
                    <strong>Libraries Published:</strong> Share a library to a Git repository and sync updates.
                </li>

                <li style={{ marginBottom: '15px' }}>
                    <strong>Libraries Subscribed:</strong> Download existing knowledge from a Git repository and sync 
                    for the latest updates.
                </li>
            </ul>
        </div>
    )
}