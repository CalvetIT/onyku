export function HomePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Knowledge Management System</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Libraries</h2>
                    <p className="text-gray-600">
                        Manage your knowledge libraries
                    </p>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Subjects</h2>
                    <p className="text-gray-600">
                        Organize subjects within libraries
                    </p>
                </div>
                
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Questions</h2>
                    <p className="text-gray-600">
                        Manage questions and their relationships
                    </p>
                </div>
            </div>
        </div>
    )
}