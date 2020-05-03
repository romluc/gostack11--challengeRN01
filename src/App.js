import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);
  useEffect(() => {
    api.get('/repositories').then((response) => {
      setRepositories(response.data);
    });
  }, [repositories]);

  async function handleLikeRepository(id) {
    await api
      .post(`/repositories/${id}/like`)
      .then((response) => {
        const { id } = response.data;
        const repoIndex = repositories.findIndex((repo) => repo.id === id);
        const newRepo = response.data;
        repositories.splice(repoIndex, 1, newRepo);
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }

  return (
    <>
      <StatusBar barStyle='light-content' />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Repositories from API</Text>

        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) => (
            <>
              {/* <Text style={styles.repository}>{repository.title}</Text> */}
              <View style={styles.repositoryContainer} key={repository.id}>
                <Text style={styles.repository}>{repository.title}</Text>
                <View style={styles.techsContainer}>
                  {repository.techs.map((tech) => (
                    <View style={styles.tech} key={tech}>
                      <Text style={styles.techText}>{tech}</Text>
                    </View>
                  ))}
                  {/* <FlatList
                    data={repository.techs}
                    keyExtractor={(repository) => repository.id}
                    renderItem={({ item: techs }) => (
                      <Text style={styles.tech}>{techs}</Text>
                    )}
                  /> */}
                </View>

                <View style={styles.likesContainer}>
                  <Text style={styles.likeText}>Likes:</Text>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {repository.likes}
                    👍🏻
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>👍🏻</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EDF2F7',
    textAlign: 'center',
    marginVertical: 20,
  },

  repositoryContainer: {
    marginVertical: 15,
    marginHorizontal: 15,
    backgroundColor: '#EDF2F7',
    padding: 20,
    borderRadius: 4,
  },
  repository: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#444',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 4,
  },
  tech: {
    backgroundColor: 'teal',
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  techText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'navy',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    padding: 15,
  },
});
