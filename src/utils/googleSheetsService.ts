
// Configuration 
const SPREADSHEET_ID = '17nfr1gMWO7FgMgY195p_pU3hh8YLS3GcyJqHDL6umg0';
const SHEET_NAME = 'Users';

// This is a frontend-only approach for demo purposes
// In a production app, this should be handled by a secure backend
export class GoogleSheetsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getAllUsers(): Promise<any[]> {
    if (!this.apiKey) return [];
    
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A2:F?key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      return rows.map((row: any[]) => ({
        id: row[0],
        name: row[1],
        email: row[2],
        avatar: row[3] || '',
        lastLogin: row[4] || '',
        registeredDate: row[5] || ''
      }));
    } catch (error) {
      console.error('Error fetching users from Google Sheets:', error);
      return [];
    }
  }

  async addUser(user: { id: string; name: string; email: string; avatar?: string }): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      const now = new Date().toISOString();
      const values = [
        [
          user.id,
          user.name,
          user.email,
          user.avatar || '',
          now, // lastLogin
          now  // registeredDate
        ]
      ];
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:F:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding user to Google Sheets:', error);
      return false;
    }
  }

  async updateUser(userId: string, userData: Partial<{ name: string; email: string; avatar?: string; lastLogin?: string }>): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      // First, get all users to find the row
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        console.error('User not found in Google Sheets');
        return false;
      }
      
      // Get current user data
      const currentData = users[userIndex];
      
      // Update with new data
      const updatedData = {
        ...currentData,
        ...userData,
        lastLogin: userData.lastLogin || new Date().toISOString()
      };
      
      // Update requires the row index in the sheet (add 2 because data starts at row 2)
      const rowIndex = userIndex + 2;
      
      const values = [
        [
          updatedData.id,
          updatedData.name,
          updatedData.email,
          updatedData.avatar,
          updatedData.lastLogin,
          updatedData.registeredDate
        ]
      ];
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A${rowIndex}:F${rowIndex}?valueInputOption=USER_ENTERED&key=${this.apiKey}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user in Google Sheets:', error);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      // First, get all users to find the row
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        console.error('User not found in Google Sheets');
        return false;
      }
      
      // Update requires the row index in the sheet (add 2 because data starts at row 2)
      const rowIndex = userIndex + 2;
      
      // Clear the row (since we can't delete it easily via the API)
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A${rowIndex}:F${rowIndex}/clear?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting user from Google Sheets:', error);
      return false;
    }
  }
}
