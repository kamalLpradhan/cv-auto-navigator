
import { google, sheets_v4 } from 'googleapis';

// Configuration 
const SPREADSHEET_ID = '17nfr1gMWO7FgMgY195p_pU3hh8YLS3GcyJqHDL6umg0';
const SHEET_NAME = 'Users';

// This is a frontend-only approach for demo purposes
// In a production app, this should be handled by a secure backend
export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets | null = null;

  constructor(apiKey: string) {
    if (!apiKey) {
      console.error('Google Sheets API key is required');
      return;
    }
    
    try {
      this.sheets = google.sheets({
        version: 'v4',
        auth: apiKey
      });
    } catch (error) {
      console.error('Error initializing Google Sheets API:', error);
    }
  }

  async getAllUsers(): Promise<any[]> {
    if (!this.sheets) return [];
    
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:F`,
      });
      
      const rows = response.data.values || [];
      
      return rows.map((row) => ({
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
    if (!this.sheets) return false;
    
    try {
      const now = new Date().toISOString();
      
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:F`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [
            [
              user.id,
              user.name,
              user.email,
              user.avatar || '',
              now, // lastLogin
              now  // registeredDate
            ]
          ]
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error adding user to Google Sheets:', error);
      return false;
    }
  }

  async updateUser(userId: string, userData: Partial<{ name: string; email: string; avatar?: string; lastLogin?: string }>): Promise<boolean> {
    if (!this.sheets) return false;
    
    try {
      // First, find the user row
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:F`,
      });
      
      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === userId);
      
      if (rowIndex === -1) {
        console.error('User not found in Google Sheets');
        return false;
      }
      
      // Get current user data
      const currentData = {
        id: rows[rowIndex][0],
        name: rows[rowIndex][1],
        email: rows[rowIndex][2],
        avatar: rows[rowIndex][3] || '',
        lastLogin: rows[rowIndex][4] || '',
        registeredDate: rows[rowIndex][5] || ''
      };
      
      // Update with new data
      const updatedData = {
        ...currentData,
        ...userData,
        lastLogin: userData.lastLogin || new Date().toISOString()
      };
      
      // Update the row
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rowIndex + 2}:F${rowIndex + 2}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              updatedData.id,
              updatedData.name,
              updatedData.email,
              updatedData.avatar,
              updatedData.lastLogin,
              updatedData.registeredDate
            ]
          ]
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user in Google Sheets:', error);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    if (!this.sheets) return false;
    
    try {
      // This is a simplistic approach - Google Sheets API doesn't directly support deleting rows
      // A real implementation would involve more complex operations or use of Apps Script
      
      // First, find the user row
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2:F`,
      });
      
      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => row[0] === userId);
      
      if (rowIndex === -1) {
        console.error('User not found in Google Sheets');
        return false;
      }
      
      // Clear the row (since we can't delete it easily)
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rowIndex + 2}:F${rowIndex + 2}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting user from Google Sheets:', error);
      return false;
    }
  }
}
